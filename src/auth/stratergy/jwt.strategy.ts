import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";


@Injectable()
export class JwtStrategy extends PassportStrategy(
    Strategy,
    'jwt'
) {
    constructor(config: ConfigService , private prisma:PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('SECRET_KEY')
            // ignoreExpiration: false,
        })     
        console.log(config.get('SECRET_KEY'));
        
    }

    async validate(payload: {sub: number , email: string}) {
        console.log("token data",{
            payload,
        })
        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub
            }
        })
        delete user.hash
        return user // this return do best things first create the user object and then assign this data into the user object and that user object assign into the request object
        // Whatever i will share from here it give into the req {req.user} object in auth controller api
    }

}